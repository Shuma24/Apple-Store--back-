import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { State } from '../types/product.constants';
import { categoryProducts } from './category.entity';
import { imagesProducts } from './product-images.entity';
import { paramsProducts } from './product-params.entity';

@Entity('Product')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @OneToMany(() => imagesProducts, (image: imagesProducts) => image.product, {
    eager: true,
    cascade: ['insert', 'update', 'remove', 'soft-remove', 'recover'],
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  image: imagesProducts[];

  @Column()
  price: number;

  @ManyToOne(
    () => categoryProducts,
    (categoty: categoryProducts) => categoty.product,
    {
      eager: true,
    },
  )
  @JoinColumn({ name: 'category_id' })
  category: categoryProducts;

  @Column({
    type: 'enum',
    enum: ['New', 'Used'],
    default: 'New',
  })
  state: State;

  @OneToOne(() => paramsProducts, (params: paramsProducts) => params.product, {
    eager: true,
    cascade: ['insert', 'update', 'remove', 'soft-remove', 'recover'],
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'params_id' })
  params: paramsProducts;

  @Column()
  description: string;

  @Column('simple-array', { nullable: true })
  color: string[];

  @Column({ default: 0 })
  rating: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
