

export type UnitDataType = {
  _id: string;
  foodName: string;
  price: number;
  image: string;
  qty: number;
};

export const saveUnitData = (
  storageKey: string,
  unit: UnitDataType
): void => {
  const existingData = localStorage.getItem(storageKey);
  const cartItems: UnitDataType[] = existingData
    ? JSON.parse(existingData)
    : [];

  const isFoodExisting = cartItems.find((food) => food._id === unit._id);

  if (isFoodExisting) {
    const newFoods = cartItems.map((food) =>
      food._id === unit._id ? { ...food, qty: unit.qty } : food
    );
    localStorage.setItem(storageKey, JSON.stringify(newFoods));
  } else {
    const newFoods = [...cartItems, unit];
    localStorage.setItem(storageKey, JSON.stringify(newFoods));
  }
};

