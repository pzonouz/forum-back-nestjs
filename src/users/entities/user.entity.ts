import { Exclude } from 'class-transformer';
import { Answer } from 'src/answers/entities/answer.entity';
import { File } from 'src/files/entities/file.entity';
import { Question } from 'src/questions/entities/question.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ nullable: true })
  firstname: string;

  @Column({ nullable: true })
  lastname: string;

  @Column({ nullable: true })
  address: string;

  @Column({ default: false })
  is_admin: boolean;

  @Column({ default: false })
  social: boolean;

  @Column({ nullable: true })
  @Exclude()
  reset_password_token: string;

  @Column({ nullable: true })
  @Exclude()
  reset_password_token_expires: Date;

  @OneToMany(() => File, (file) => file.user, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinTable({
    name: 'useremail',
    joinColumn: { referencedColumnName: 'email' },
  })
  files: File[];

  @OneToMany(() => Question, (question) => question.user, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinTable({
    name: 'useremail',
    joinColumn: { referencedColumnName: 'email' },
  })
  questions: Question[];

  @OneToMany(() => Answer, (answer) => answer.user, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinTable({
    name: 'useremail',
    joinColumn: { referencedColumnName: 'email' },
  })
  answers: Answer[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
