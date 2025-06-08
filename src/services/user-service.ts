import { AppDataSource } from '../data-source';
import { User } from '../entities/user';
import { redisClient } from '../redis/client';

export class UserService {
  private userRepository = AppDataSource.getRepository(User);

  async createUser(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    const savedUser = await this.userRepository.save(user);

    // Cache user data in Redis for 1 hour
    await redisClient.set(
      `user:${savedUser.id}`,
      JSON.stringify(savedUser.toJSON()),
      3600
    );

    return savedUser;
  }

  async getUserById(id: string): Promise<User | null> {
    // Try to get from cache first
    const cached = await redisClient.get(`user:${id}`);
    if (cached) {
      return JSON.parse(cached) as User;
    }

    // If not in cache, get from database
    const user = await this.userRepository.findOne({ where: { id } });

    if (user) {
      // Cache for future requests
      await redisClient.set(`user:${id}`, JSON.stringify(user.toJSON()), 3600);
    }

    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    // For authentication, we need the password, so don't use cache
    return this.userRepository.findOne({ where: { email } });
  }

  async updateUser(
    id: string,
    updateData: Partial<User>
  ): Promise<User | null> {
    await this.userRepository.update(id, updateData);

    // Invalidate cache
    await redisClient.del(`user:${id}`);

    return this.getUserById(id);
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await this.userRepository.delete(id);

    // Remove from cache
    await redisClient.del(`user:${id}`);

    return result.affected !== 0;
  }

  async getAllUsers(
    page: number = 1,
    limit: number = 10
  ): Promise<{ users: User[]; total: number }> {
    const [users, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { users, total };
  }
}
