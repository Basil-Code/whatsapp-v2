// implicit function (straight return)
const getRecipientEmail = (users, userLoggedIn) =>
  // Array.filter() --> filter the contents of an array based on a condition, then return a new array
  // we only want One element from that new array after filtered cuz there'll only be one element inside the array which is the recipient email
  users?.filter((userToFilter) => userToFilter !== userLoggedIn?.email)[0];

export default getRecipientEmail;
