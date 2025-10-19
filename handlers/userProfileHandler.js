const { User } = require('../models/userSchema');

const fetchUserData = async (req, res) => {
  try {
    const user = await User.findOne({ userName: req.params.username });

    if (!user) {
      return res.status(404).send({
        code: 1009,
        msg: 'User not found',
      });
    }

    res.status(200).send({
      code: 1010,
      msg: 'Data fetched successfully',
      user,
    });
  } catch (error) {
    res.status(500).send({
      code: 1004,
      msg: 'Error fetching user data',
      error,
    });
  }
};


const updateUserData = async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { userName: req.params.username },
      { $set: req.body },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send({
        code: 1009,
        msg: 'User not found',
      });
    }

    res.status(200).send({
      code: 1011,
      msg: 'User data updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).send({
      code: 1004,
      msg: 'Error updating user data',
      error,
    });
  }
};

module.exports = {
  fetchUserData,
  updateUserData,
};
