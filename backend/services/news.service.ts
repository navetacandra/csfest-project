import { NewsRepository } from '../repositories/news.repository';
import type { News } from '../models/news.model';

export class NewsService {
  private newsRepository: NewsRepository;

  constructor() {
    this.newsRepository = new NewsRepository();
  }

  getAll(page: number, limit: number) {
    return this.newsRepository.all(page, limit);
  }

  getById(id: number) {
    const news = this.newsRepository.findById(id);
    if (!news) {
      throw new Error("News not found");
    }
    return news;
  }

  create(data: Omit<News, 'id' | 'created_at' | 'updated_at'>) {
    const newNewsId = this.newsRepository.create(data);
    return this.newsRepository.findById(Number(newNewsId));
  }
  
  update(id: number, data: Partial<Omit<News, 'id' | 'created_at' | 'updated_at'>>) {
    this.newsRepository.update(id, data);
    return this.newsRepository.findById(id);
  }

  delete(id: number) {
    const news = this.newsRepository.findById(id);
    if (!news) {
      throw new Error("News not found");
    }
    this.newsRepository.delete(id);
    return news;
  }
}
