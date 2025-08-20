export const generateTempId = (): string => {
  return `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const isTempId = (id: string): boolean => {
  return id.startsWith("temp_");
};

export const separateNewAndUpdatedArrayValues = <T extends { _id: string }>(
  array: T[]
): { newValues: T[]; updatedValues: T[] } => {
  const newValues = array.filter((value) => isTempId(value._id));
  const updatedValues = array.filter((value) => !isTempId(value._id));
  return { newValues, updatedValues };
};
