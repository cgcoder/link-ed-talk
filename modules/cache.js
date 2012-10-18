/*
  Cache module implementation
*/

exports.cache = (function() {
  return {
    newCache: function()
    {
      return {
        data: {}
      };
    },
    deleteCache: function(c)
    {
      c.data = null;
    } 
  };
})();
