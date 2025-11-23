import { NewsRepository } from "../repositories/news.repository";
import type { News } from "../models/news.model";
import { Sqlite } from "../config/database";

export class NewsService {
  private newsRepository: NewsRepository;

  constructor(sqlite: Sqlite) {
    this.newsRepository = new NewsRepository(sqlite);
  }

  getAll(page: number, limit: number): News[] {
    return this.newsRepository.all(page, limit);
  }

  getById(id: number): News {
    const news = this.newsRepository.findById(id);
    if (!news) {
      throw new Error("News not found");
    }
    return news;
  }

  create(data: Omit<News, "id" | "created_at" | "updated_at">): News | null {
    const newNewsId = this.newsRepository.create(data);
    return this.newsRepository.findById(Number(newNewsId));
  }

  update(
    id: number,
    data: Partial<Omit<News, "id" | "created_at" | "updated_at">>,
  ): News | null {
    this.newsRepository.update(id, data);
    return this.newsRepository.findById(id);
  }

  delete(id: number): News {
    const news = this.newsRepository.findById(id);
    if (!news) {
      throw new Error("News not found");
    }
    this.newsRepository.delete(id);
    return news;
  }
}
