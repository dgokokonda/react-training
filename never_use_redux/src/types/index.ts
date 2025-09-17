export type User = {
  id: string;
  email: string;
  username: string;
};

export type TodoType = {
  id: number,
  name: string,
  createdAt: string,
  done: boolean
}

export type Category = {
  title: string,
  url: string
}

export type CategoriesDataArray = {
  categories: Category[],
  image: string,
  title: string,
  url: string
}

export type CategoriesObject = {
  data: CategoriesDataArray[],
  message: string
}