module.exports = (sequelize) => {
  const { users, items, item_claims } = sequelize.models;

  // ======= users 和 items 的關聯 =======
  // 一個使用者可以建立多個物品
  users.hasMany(items, {
    foreignKey: "created_by",
    as: "createdItems",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // 每個物品都屬於一個創建者
  items.belongsTo(users, {
    foreignKey: "created_by",
    as: "creator",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // ======= users 和 item_claims 的關聯 =======
  // 一個使用者可以提出多個認領申請
  users.hasMany(item_claims, {
    foreignKey: "claimed_by",
    as: "itemClaims",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // 每個認領申請都屬於一個使用者
  item_claims.belongsTo(users, {
    foreignKey: "claimed_by",
    as: "claimer",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // ======= items 和 item_claims 的關聯 =======
  // 一個物品可以有多個認領申請
  items.hasMany(item_claims, {
    foreignKey: "item_id",
    as: "claims",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // 每個認領申請都對應一個物品
  item_claims.belongsTo(items, {
    foreignKey: "item_id",
    as: "item",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};
