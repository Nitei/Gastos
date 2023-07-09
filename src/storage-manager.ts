type TypeStorageMethods = {
  storage: Storage;
};

class StorageMethods<T> {
  private data: TypeStorageMethods;

  constructor(data: TypeStorageMethods) {
    this.data = data;
  }

  getKey(name: keyof T) {
    return JSON.parse(this.data.storage.getItem(name as string) as string);
  }

  setKey(name: keyof T, newValue: any, stringuify = true) {
    this.data.storage.setItem(
      name as string,
      stringuify ? JSON.stringify(newValue) : newValue
    );
  }
}

export class StorageUtils<T> {
  constructor(
    public session = new StorageMethods<T>({ storage: sessionStorage }),
    public local = new StorageMethods<T>({ storage: localStorage })
  ) {}
}

