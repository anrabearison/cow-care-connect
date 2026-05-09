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

  if (transformed.herd_book_id) {
    transformed.herdBookId =
      typeof transformed.herd_book_id === "object"
        ? transformed.herd_book_id.id
        : transformed.herd_book_id;
    delete transformed.herd_book_id;
  }

  if (transformed.cattle_id) {
    transformed.cattleId =
      typeof transformed.cattle_id === "object"
        ? transformed.cattle_id.id
        : transformed.cattle_id;
    delete transformed.cattle_id;
  }

  if (transformed.category_id) {
    transformed.categoryId =
      typeof transformed.category_id === "object"
        ? transformed.category_id.id
        : transformed.category_id;
    delete transformed.category_id;
  }

  if (transformed.status_id) {
    transformed.statusId =
      typeof transformed.status_id === "object"
        ? transformed.status_id.id
        : transformed.status_id;
    delete transformed.status_id;
  }

  if (transformed.n_carnet !== undefined) {
    transformed.nCarnet = transformed.n_carnet;
    delete transformed.n_carnet;
  }

  if (transformed.cattle) {
    transformed.cattle = transformCattleData(transformed.cattle);
  }

  return transformed;
};

