const UserModel = require('../Models/user');

exports.register = async (req, res) => {
    try {
        const { name, email, photoUrl } = req.body;
        if (!email || !name) {
            return res.status(400).json({ message: "Name and email are required" });
        }

        const userExist = await UserModel.findOne({ email: email });
        if (!userExist) {
            const newUser = new UserModel({
                name,
                email,
                photoUrl
            });

            await newUser.save();

            return res.status(201).json({
                message: "User registered successfully",
                user: newUser
            });
        }

        return res.status(200).json({
            message: "Welcome Back",
            user: userExist
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Server error', message: err.message });
    }
}
