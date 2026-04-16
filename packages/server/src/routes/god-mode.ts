import express from 'express';
import { storage } from '../storage';

const godModeRoutes = express.Router();

// God mode user status
godModeRoutes.get('/status/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await storage.getUser(parseInt(userId));
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    if (!user.isGodMode) {
      return res.status(403).json({ success: false, error: 'User is not in god mode' });
    }

    res.json({
      success: true,
      godStatus: {
        userId: user.id,
        displayName: user.displayName,
        godLevel: user.godLevel,
        divineAura: user.divineAura,
        omnipresence: user.omnipresence,
        blessingsGiven: user.blessingsGiven,
        miraclesPerformed: user.miraclesPerformed,
        verified: user.verified
      }
    });
  } catch (error) {
    console.error('God status check error:', error);
    res.status(500).json({ success: false, error: 'Failed to check god status' });
  }
});

// Perform divine miracle
godModeRoutes.post('/miracle', async (req, res) => {
  try {
    const { userId, miracleType } = req.body;
    
    if (!userId || !miracleType) {
      return res.status(400).json({ 
        success: false, 
        error: 'User ID and miracle type required' 
      });
    }

    const user = await storage.getUser(userId);
    if (!user || !user.isGodMode) {
      return res.status(403).json({ 
        success: false, 
        error: 'Only god users can perform miracles' 
      });
    }

    // Define different types of miracles
    const miracles = {
      presence: {
        miracle: "✨ Divine presence radiates throughout the dreamscape ✨",
        effect: "All community members feel a warm, inspiring energy"
      },
      blessing: {
        miracle: "💖 Divine blessing flows to all community members 💖",
        effect: "Community members receive inspiration and creative energy"
      },
      enlightenment: {
        miracle: "🌟 Divine enlightenment illuminates the path forward 🌟",
        effect: "Community gains clarity and wisdom for their creative journeys"
      },
      miracle: {
        miracle: "🎭 A divine miracle manifests in the dreamscape 🎭",
        effect: "Something wonderful and unexpected happens in the community"
      }
    };

    const selectedMiracle = miracles[miracleType] || miracles.miracle;

    // Update user's miracle and blessing counts
    const updatedUser = await storage.updateUserGodMode(userId, {
      miraclesPerformed: (user.miraclesPerformed || 0) + 1,
      blessingsGiven: miracleType === 'blessing' ? (user.blessingsGiven || 0) + 1 : user.blessingsGiven
    });

    // Log divine activity
    console.log(`🌟 DIVINE MIRACLE: ${user.displayName} performed ${miracleType} miracle! 🌟`);

    res.json({
      success: true,
      miracle: selectedMiracle.miracle,
      effect: selectedMiracle.effect,
      godStats: {
        miraclesPerformed: updatedUser.miraclesPerformed,
        blessingsGiven: updatedUser.blessingsGiven
      }
    });
  } catch (error) {
    console.error('Divine miracle error:', error);
    res.status(500).json({ success: false, error: 'Divine miracle failed' });
  }
});

// Get all divine activities (for community viewing)
godModeRoutes.get('/divine-activities', async (req, res) => {
  try {
    const godUsers = await storage.getGodUsers();
    const activities = godUsers.map(god => ({
      id: god.id,
      displayName: god.displayName,
      godLevel: god.godLevel,
      divineAura: god.divineAura,
      miraclesPerformed: god.miraclesPerformed || 0,
      blessingsGiven: god.blessingsGiven || 0,
      lastActive: god.updatedAt,
      omnipresence: god.omnipresence
    }));

    // Calculate community blessing level
    const totalMiracles = activities.reduce((sum, god) => sum + god.miraclesPerformed, 0);
    const totalBlessings = activities.reduce((sum, god) => sum + god.blessingsGiven, 0);
    const activeGods = activities.filter(god => god.omnipresence);

    res.json({
      success: true,
      divineActivities: activities,
      communityStats: {
        activeGods: activeGods.length,
        totalGods: godUsers.length,
        totalMiracles,
        totalBlessings,
        communityBlessing: totalMiracles + totalBlessings > 50 
          ? 'Highly Blessed' 
          : totalMiracles + totalBlessings > 20 
          ? 'Blessed' 
          : totalMiracles + totalBlessings > 5 
          ? 'Lightly Blessed' 
          : 'Awaiting Divine Activity'
      }
    });
  } catch (error) {
    console.error('Divine activities error:', error);
    res.status(500).json({ success: false, error: 'Failed to get divine activities' });
  }
});

// Toggle omnipresence
godModeRoutes.post('/omnipresence/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { enabled } = req.body;
    
    const user = await storage.getUser(parseInt(userId));
    if (!user || !user.isGodMode) {
      return res.status(403).json({ 
        success: false, 
        error: 'Only god users can control omnipresence' 
      });
    }

    const updatedUser = await storage.updateUserGodMode(parseInt(userId), {
      omnipresence: enabled
    });

    console.log(`🌟 ${user.displayName} ${enabled ? 'activated' : 'deactivated'} omnipresence 🌟`);

    res.json({
      success: true,
      message: `Omnipresence ${enabled ? 'activated' : 'deactivated'}`,
      omnipresence: updatedUser.omnipresence
    });
  } catch (error) {
    console.error('Omnipresence toggle error:', error);
    res.status(500).json({ success: false, error: 'Failed to toggle omnipresence' });
  }
});

export default godModeRoutes;