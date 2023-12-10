const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const DB = require('../database/index');

module.exports.signup = (req, res) => {
    const { email, password, username } = req.body;
    const sql_1 = 'SELECT COUNT(*) AS count FROM users WHERE email = ?'
    DB.query(sql_1, [email], (err, results) => {
        if (err) {
            console.error('Error checking DB: ', err);
            res.status(500).send('Error Checking DB');
            return;
        }
        const count = results[0].count;
        if (count > 0) {
            res.status(404).json({state: 'UAE', message: 'User already exists' });
            return;
        }
        const sql_2 = 'INSERT INTO users (email,username, password) VALUES (?,?,?)';
        bcrypt.hash(password, 12, (err, hash) => {
            if (err) return res.status(404).json('Error in hashing password');
            DB.query(sql_2, [email, username, hash], (err, data) => {
                if (err) return res.status(500).json('Error inserting data into table');
                const token = jwt.sign({ name: username }, process.env.JWT_SECRET, { expiresIn: '1h' });
                console.log(data);
                return res.status(200).json({ state: 'SSI', result: { user: username, token }, message: 'Successfully Signed In' });
            });

        });
    })
};

module.exports.login = (req, res) => {
    const sql = 'SELECT * FROM users WHERE email = ? OR username = ?'
    const { value, password } = req.body;
    DB.query(sql, [value, value], async (err, data) => {
        if (err) return res.status(500).json('Error checking data from table');
        if (data.length > 0) {
            const isPasswordCorrect = await bcrypt.compare(password, data[0].password);
            if (!isPasswordCorrect) {
                return res.status(400).json({ state: 'IC', message: 'Invalid Credentials' });
            }
            const token = jwt.sign({ name: data[0].username }, process.env.JWT_SECRET, { expiresIn: '1h' });

            return res.status(200).json({ state: 'SSI', result: { user: data[0].username, token }, message: 'Successfully Logged In' });
        }
        else {
            return res.status(404).json({ state: 'UDE', message: 'User does not exist. Please Sign In!' });
        }
    })
}