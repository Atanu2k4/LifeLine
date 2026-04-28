import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import { getFirebaseAdmin, saveDocument, getDocument, getUserByEmail, incrementSigninCount } from '../lib/firebaseAdmin.js';

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Verify Token (Failover Strategy: Google OAuth -> Firebase Auth)
router.post('/google', async (req, res) => {
  const { idToken, provider = 'google' } = req.body;

  if (!idToken) {
    return res.status(400).json({ error: 'No ID token provided' });
  }

  try {
    let userData = null;
    let googleId = null;

    try {
      console.log('🔐 [Auth] Attempting Pure Google verification...');
      const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      googleId = payload.sub;
      userData = {
        id: googleId,
        email: payload.email,
        name: payload.name,
        photoURL: payload.picture,
        provider: 'google_pure'
      };
    } catch (googleError) {
      console.log('🔄 [Auth] Pure Google failed, trying Firebase fallback...');
      const auth = getFirebaseAdmin().auth();
      const decodedToken = await auth.verifyIdToken(idToken);
      googleId = decodedToken.uid;
      userData = {
        id: googleId,
        email: decodedToken.email,
        name: decodedToken.name,
        photoURL: decodedToken.picture,
        provider: 'firebase_google'
      };
    }

    const dbUser = await getDocument('users', googleId);
    userData.updatedAt = new Date().toISOString();

    if (!dbUser) {
      userData.createdAt = new Date().toISOString();
      userData.signinCount = 1;
      await saveDocument('users', googleId, userData);
    } else {
      await incrementSigninCount(googleId);
      await saveDocument('users', googleId, {
        name: userData.name,
        photoURL: userData.photoURL,
        updatedAt: userData.updatedAt
      });
      userData = { ...dbUser, ...userData };
    }

    res.json({ success: true, user: userData });
  } catch (error) {
    console.error('❌ [Auth Failover] All methods failed:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
});

// Check if user exists by email
router.post('/check-email', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(200).json({ success: false, exists: false });
    }

    res.status(200).json({ success: true, exists: true, user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check user' });
  }
});

// Sign in/up user (Legacy/Email)
router.post('/signin', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await getUserByEmail(email);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    await incrementSigninCount(user.id);
    const updatedUser = await getDocument('users', user.id);
    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: 'Sign-in failed' });
  }
});

// Update Profile
router.put('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;
    await saveDocument('users', userId, { ...updates, updatedAt: new Date().toISOString() });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Update failed' });
  }
});

export default router;
