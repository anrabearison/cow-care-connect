// Central helpers for transforming admin-related payloads

export const transformCattleData = (data: any) => {
  const transformed = { ...data };

  if (transformed.category && typeof transformed.category === "object") {
    transformed.category = transformed.category.id;
  }

  if (transformed.character && typeof transformed.character === "object") {
    transformed.character = transformed.character.id;
  }

  if (transformed.status && typeof transformed.status === "object") {
    transformed.status = transformed.status.id;
  }

  if ("status" in transformed) {
    delete transformed.status;
  }

  if (transformed.source && "purchaseCategory" in transformed.source) {
    delete transformed.source.purchaseCategory;
  }

  return transformed;
};

export const transformHerdBookCattleData = (data: any) => {
  const transformed = { ...data };

  if (transformed.herdBookId) {
    transformed.herdBookId =
      typeof transformed.herdBookId === "object"
        ? transformed.herdBookId.id
        : transformed.herdBookId;
  }

  if (transformed.cattleId) {
    transformed.cattleId =
      typeof transformed.cattleId === "object"
        ? transformed.cattleId.id
        : transformed.cattleId;
  }

  if (transformed.categoryId) {
    transformed.categoryId =
      typeof transformed.categoryId === "object"
        ? transformed.categoryId.id
        : transformed.categoryId;
  }

  if (transformed.statusId) {
    transformed.statusId =
      typeof transformed.statusId === "object"
        ? transformed.statusId.id
        : transformed.statusId;
  }

  if (transformed.cattle) {
    transformed.cattle = transformCattleData(transformed.cattle);
  }

  return transformed;
};

