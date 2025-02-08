const User = require('../models/User');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail'); // You'll need to implement this

const authController = {
    register: async (req, res) => {
        try {
            const { email, password, walletId, userId } = req.body;
            
            const user = new User({
                email,
                password,
                walletId,
                usdtBalance: 10000, // TODO:Take it from .env file
                userId
            });

            await user.save();
            const token = await user.generateAuthToken();
            
            res.status(201).json({
                success: true,
                data: { user, token }
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findByCredentials(email, password);
            const token = await user.generateAuthToken();
            
            res.json({
                success: true,
                data: { user, token }
            });
        } catch (error) {
            res.status(401).json({
                success: false,
                message: 'Invalid login credentials'
            });
        }
    },

    logout: async (req, res) => {
        try {
            req.user.tokens = req.user.tokens.filter(token => token.token !== req.token);
            await req.user.save();
            
            res.json({
                success: true,
                message: 'Logged out successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    logoutAll: async (req, res) => {
        try {
            req.user.tokens = [];
            await req.user.save();
            
            res.json({
                success: true,
                message: 'Logged out from all devices successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    changePassword: async (req, res) => {
        try {
            const { currentPassword, newPassword } = req.body;
            const user = await User.findOne({ userId: req.user.userId });

            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: 'Current password is incorrect'
                });
            }

            user.password = newPassword; // Will be hashed by pre-save middleware
            await user.save();

            // Logout from all devices (optional)
            user.tokens = [];
            await user.save();

            res.json({
                success: true,
                message: 'Password changed successfully. Please login again.'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    resetPasswordRequest: async (req, res) => {
        try {
            const { email } = req.body;
            const user = await User.findOne({ email });

            // Generate reset token
            const resetToken = crypto.randomBytes(32).toString('hex');
            const resetTokenExpiry = Date.now() + 3600000; // 1 hour

            // Save hashed token
            user.resetPasswordToken = crypto
                .createHash('sha256')
                .update(resetToken)
                .digest('hex');
            user.resetPasswordExpires = resetTokenExpiry;
            await user.save();

            // Create reset URL
            const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

            // Send email
            await sendEmail({
                email: user.email,
                subject: 'Password Reset Request',
                message: `You requested a password reset. Please go to this link to reset your password: ${resetUrl}\n\nThis link will expire in 1 hour.\n\nIf you didn't request this, please ignore this email.`
            });

            res.json({
                success: true,
                message: 'Password reset email sent'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error sending password reset email'
            });
        }
    },

    resetPassword: async (req, res) => {
        try {
            const { token, newPassword } = req.body;

            // Get hashed token
            const resetPasswordToken = crypto
                .createHash('sha256')
                .update(token)
                .digest('hex');

            const user = await User.findOne({
                resetPasswordToken,
                resetPasswordExpires: { $gt: Date.now() }
            });

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid or expired reset token'
                });
            }

            // Set new password
            user.password = newPassword;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();

            // Logout from all devices
            user.tokens = [];
            await user.save();

            res.json({
                success: true,
                message: 'Password has been reset. Please login with your new password.'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
};

module.exports = authController; 