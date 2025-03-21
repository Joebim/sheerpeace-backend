const { db } = require("../config/db");

const Search = {
  addOrUpdateQuery: async (query) => {
    query = query.toLowerCase();

    const existing = await db("searches").where({ query }).first();

    if (existing) {
      return db("searches")
        .where({ query })
        .update({ count: existing.count + 1, updated_at: db.fn.now() });
    } else {
      return db("searches").insert({ query });
    }
  },

  addMultipleSearches: async (queries) => {
    if (!Array.isArray(queries) || queries.length === 0) {
      throw new Error("Queries must be a non-empty array.");
    }

    // Normalize queries (convert to lowercase and remove duplicates)
    const uniqueQueries = [...new Set(queries.map((q) => q.toLowerCase()))];

    // Upsert (insert if not exists, otherwise update count)
    for (const query of uniqueQueries) {
      await Search.addOrUpdateQuery(query);
    }
  },

  getSuggestions: async (searchTerm) => {
    let suggestions;

    if (searchTerm) {
      // 🔹 Get matching searches
      suggestions = await db("searches")
        .select("query")
        .where("query", "like", `${searchTerm}%`)
        .orderBy("count", "desc")
        .limit(5);
    }

    // 🔹 If no results OR searchTerm is empty, return top 5 popular searches
    if (!searchTerm || suggestions.length === 0) {
      suggestions = await db("searches")
        .select("query")
        .orderBy("count", "desc")
        .limit(8);
    }

    return suggestions;
  },
};

module.exports = Search;
