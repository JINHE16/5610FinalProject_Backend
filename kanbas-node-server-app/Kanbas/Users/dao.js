import model from "./model.js";

export const createUser = (user) => {
    delete user._id;
    return model.create(user);
} 
export const findAllUsers = () => model.find();
export const findUserById = (userId) => model.findById(userId);
export const findUserByUsername = (username) =>  model.findOne({ username: username }); // find a unique document and retrieve one
export const findUserByCredentials = async (username, password) => {
  console.log("Finding user with credentials:", { username, password }); // Add debug log
  
  try {
      const user = await model.findOne({ username });
      console.log("Found user by username:", user); // Add debug log
      
      if (!user) {
          console.log("No user found with username:", username);
          return null;
      }
      
      if (user.password !== password) {
          console.log("Password mismatch for user:", username);
          return null;
      }
      
      return user;
  } catch (error) {
      console.error("Error in findUserByCredentials:", error);
      throw error;
  }
};
export const updateUser = (userId, user) =>  model.updateOne({ _id: userId }, { $set: user });
export const deleteUser = (userId) => model.deleteOne({ _id: userId });
export const findUsersByRole = (role) => model.find({ role: role });
export const findUsersByPartialName = (partialName) => {
    const regex = new RegExp(partialName, "i"); // 'i' makes it case-insensitive
    return model.find({
      $or: [{ firstName: { $regex: regex } }, { lastName: { $regex: regex } }],
    });
};
