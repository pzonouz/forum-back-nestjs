import { Answer } from 'src/answers/entities/answer.entity';
import { File } from 'src/files/entities/file.entity';
import { User } from 'src/users/entities/user.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  title: string;

  @Column()
  description: string;

  @Column({ default: false })
  solved: boolean;

  @Column('text', { array: true, nullable: true })
  filenames: string[];

  @Column({
    type: 'tsvector',
    generatedType: 'STORED',
    asExpression: "to_tsvector('english', title || ' ' || description)",
  })
  tsv_column: string;

  @ManyToOne(() => User, (user) => user.questions)
  @JoinColumn()
  user: User;

  @OneToMany(() => Answer, (answer) => answer.question)
  answers: Answer[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
