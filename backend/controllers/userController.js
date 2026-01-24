import Student from '../models/Student.js';

// Signup user (frontend compatible)
export const signupUser = async (req, res) => {
  try {
    const { username, email, password, age, married, employment } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    // Check if user already exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Create new student
    const newStudent = new Student({
      name: username,
      email,
      password, // Note: In production, hash the password using bcrypt
      rollNumber: `TEMP-${Date.now()}`, // Temporary roll number
      semester: 1, // Default semester
      branch: 'General', // Default branch
      phoneNumber: '0000000000', // Default phone
      age: age || null,
      maritalStatus: married || null,
      employmentStatus: employment || null,
    });

    await newStudent.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newStudent._id,
        username: newStudent.name,
        email: newStudent.email,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Error registering user: ' + error.message });
  }
};

// Login user (frontend compatible)
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Find user by username (name field in database)
    const student = await Student.findOne({ name: username });
    if (!student) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Compare password
    if (student.password !== password) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: student._id,
        username: student.name,
        email: student.email,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in: ' + error.message });
  }
};
