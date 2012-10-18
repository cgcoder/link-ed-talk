/*
  Friend list provider
*/

apple = {
  userId: "apple",
};

boy = {
  userId: "boy",
};

cat = {
  userId: "cat",
};

exports.friendProvider = (function()
{
  return {
    listFriends: function(userId)
    {
      var friends = new Array();
     if (userId==='apple')
      {
        friends[0] = boy;
        friends[1] = cat; 
      }
      else if(userId === 'boy')
      {
        friends[0] = apple; 
      }
      else if(userId === 'cat')
      {
        friends[0] = apple; 
      }

      return friends;
    } 
  };
})();

