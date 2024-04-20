import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { PostModule } from './modules/post/post.module';
import { CommonModule } from './common/common.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TokenModule } from './modules/token/token.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    UserModule,
    PostModule,
    CommonModule,
    ServeStaticModule.forRoot({
      rootPath: process.cwd() + '/public',
    }),
    TokenModule,
    AdminModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
