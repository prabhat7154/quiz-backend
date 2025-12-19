const User = require("../user/user.model");
const bcrypt = require("bcryptjs");

// 🟢 REGISTER
exports.register = async (req, reply) => {
  try {
    const { name, email, password, role } = req.body;

    // email already exist?
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return reply.code(400).send({
        message: "Email already registered"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role
    });

    await user.save();

    reply.send({
      message: "User registered successfully"
    });
  } catch (err) {
    reply.code(500).send({ message: err.message });
  }
};

// 🟢 LOGIN
exports.login = async (req, reply) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return reply.code(400).send({
        message: "Invalid email or password"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return reply.code(400).send({
        message: "Invalid email or password"
      });
    }

    const token = req.server.jwt.sign({
      userId: user._id,
      role: user.role
    });

    reply.send({
      message: "Login successful",
      token
    });
  } catch (err) {
    reply.code(500).send({ message: err.message });
  }
};
