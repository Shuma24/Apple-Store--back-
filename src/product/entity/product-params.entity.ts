import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity('params_products')
export class paramsProducts {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  screen?: string;

  @Column({ nullable: true })
  camera?: string;

  @Column({ nullable: true })
  processor?: string;

  @Column({ nullable: true })
  RAM?: string;

  @Column('simple-array', { nullable: true })
  memory?: number[];

  @Column({ nullable: true })
  corps?: string;

  @Column({ nullable: true })
  GPS?: string;

  @Column({ nullable: true })
  type?: string;

  @OneToOne(() => Product, (product: Product) => product.params)
  product: Product;
}
