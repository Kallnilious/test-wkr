import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { existsSync } from 'fs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { WorkoutsModule } from './workouts/workouts.module';
import { GoalsModule } from './goals/goals.module';

const serveStaticConfig = () => {
  // Path to frontend static files (relative to this file's location)
  const frontendPath = join(__dirname, '..', '..', 'frontend-dist');
  
  // Only serve static files if the directory exists
  if (existsSync(frontendPath)) {
    return ServeStaticModule.forRoot({
      rootPath: frontendPath,
      exclude: ['/api*', '/auth*', '/users*', '/goals*', '/workouts*'],
      serveStaticOptions: { fallback: 'index.html' },
    });
  }
  
  // Return empty module if directory doesn't exist (development)
  return [];
};

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    WorkoutsModule,
    GoalsModule,
    ...serveStaticConfig(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
