import Student from '../models/Student.js';


export const registerStudent = async (req, res) => {
  try {
    const { name, email, password, rollNumber, semester, branch, phoneNumber } = req.body;

   
    if (!name || !email || !password || !rollNumber || !semester || !branch || !phoneNumber) {
      return res.status(400).json({ message: 'All fields are required' });
    }

   
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: 'Student with this email already exists' });
    }

    const existingRoll = await Student.findOne({ rollNumber });
    if (existingRoll) {
      return res.status(400).json({ message: 'Roll number already exists' });
    }


    const newStudent = new Student({
      name,
      email,
      password, 
      rollNumber,
      semester,
      branch,
      phoneNumber,
    });

    await newStudent.save();

    res.status(201).json({
      message: 'Student registered successfully',
      student: {
        id: newStudent._id,
        name: newStudent.name,
        email: newStudent.email,
        rollNumber: newStudent.rollNumber,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering student', error: error.message });
  }
};


export const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    
    if (student.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({
      message: 'Login successful',
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        rollNumber: student.rollNumber,
        semester: student.semester,
        branch: student.branch,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};


export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students', error: error.message });
  }
};


export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student', error: error.message });
  }
};
