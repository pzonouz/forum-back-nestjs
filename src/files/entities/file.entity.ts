import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class File {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  filename: string;

  @Column({ default: '', unique: true })
  title: string;

  @ManyToOne(() => User, (user) => user.files)
  user: User;

  @Column({
    type: 'tsvector',
    generatedType: 'STORED',
    asExpression: "to_tsvector('english', title)",
  })
  tsv_column: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
