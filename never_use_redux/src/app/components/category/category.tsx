'use client'
import { CategoriesDataArray, Category } from '@/types'
import Image from 'next/image';

interface CategoriesProps {
  category: CategoriesDataArray;
}

function CategoryComponent({ category }: CategoriesProps) {
  return (
    <div className="category-menu flex items-center flex-col justify-center m-4">
      {category.title && <a href={'https://dns-shop.ru' + category.url} target="_blank"><h3 className="text-orange-300">{category.title}</h3></a>}
      {category.image && <Image src={category.image} height={60} width={60} alt={category.title} />}
      <div className="categories-list flex items-center flex-col justify-center">
        {
          category.categories && category.categories.map((item: Category) =>
            (<a key={item.title} href={'https://dns-shop.ru' + item.url} target="_blank">{item.title}</a>)
          )
        }
      </div>
    </div>
  )
}

export default CategoryComponent