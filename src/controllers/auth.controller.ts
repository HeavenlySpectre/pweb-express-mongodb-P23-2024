import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, email, password } = req.body;

        // Validation
        if (!username || !email || !password) {
            res.status(400).json({
                status: 'failed',
                message: 'All fields are required',
                data: {}
            });
            return;
        }

        // Check existing user
        const existingUser = await User.findOne({
            $or: [{ username }, { email }]
        });

        if (existingUser) {
            res.status(400).json({
                status: 'failed',
                message: 'Username or email already exists',
                data: {}
            });
            return;
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = new User({
            username,
            email,
            password: hashedPassword
        });

        await user.save();

        res.status(201).json({
            status: 'success',
            message: 'User registered successfully',
            data: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Registration failed',
            data: {}
        });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, email, password } = req.body;

        // Find user
        const user = await User.findOne({
            $or: [
                { username: username || '' },
                { email: email || '' }
            ]
        });

        if (!user) {
            res.status(401).json({
                status: 'failed',
                message: 'Invalid credentials',
                data: {}
            });
            return;
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            res.status(401).json({
                status: 'failed',
                message: 'Invalid credentials',
                data: {}
            });
            return;
        }

        // Generate token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '1h' }
        );

        res.json({
            status: 'success',
            message: 'Login successful',
            data: {
                user: {
                    username: user.username,
                    email: user.email
                },
                token
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Login failed',
            data: {}
        });
    }
};
