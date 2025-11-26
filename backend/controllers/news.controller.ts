import type { Request, Response } from "express";
import { NewsService } from "../services/news.service";
import { FileRepository } from "../repositories/file.repository";
import { Sqlite } from "../config/database";
import type { SuccessResponse, ErrorResponse } from "../config/response";
import type { News } from "../models/news.model";

export class NewsController {
  private newsService: NewsService;
  private fileRepo: FileRepository;

  constructor(sqlite: Sqlite) {
    this.newsService = new NewsService(sqlite);
    this.fileRepo = new FileRepository(sqlite);
  }

  getAll(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const newsList = this.newsService.getAll(Number(page), Number(limit));

      const totalData = newsList.length;
      const totalPages = Math.ceil(totalData / Number(limit));

      res.json({
        code: 200,
        data: newsList,
        meta: {
          size: newsList.length,
          page: Number(page),
          limit: Number(limit),
          totalData: totalData,
          totalPage: totalPages,
        },
      } as SuccessResponse<News[]>);
    } catch (error) {
      res.status(500).json({
        code: 500,
        error: {
          message: (error as Error).message || "Internal server error",
          code: "INTERNAL_ERROR",
        },
      } as ErrorResponse);
    }
  }

  getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);

      if (isNaN(id)) {
        return res.status(400).json({
          code: 400,
          error: {
            message: "Invalid news ID",
            code: "VALIDATION_ERROR",
          },
        } as ErrorResponse);
      }

      const news = this.newsService.getById(id);

      res.json({
        code: 200,
        data: news,
      } as SuccessResponse<News>);
    } catch (error) {
      if ((error as Error).message === "News not found") {
        return res.status(404).json({
          code: 404,
          error: {
            message: "News not found",
            code: "NOT_FOUND",
          },
        } as ErrorResponse);
      }

      res.status(500).json({
        code: 500,
        error: {
          message: (error as Error).message || "Internal server error",
          code: "INTERNAL_ERROR",
        },
      } as ErrorResponse);
    }
  }

  create(req: Request, res: Response) {
    try {
      const { title, content } = req.body;
      let thumbnail_file_id: number | null = null;
      if (req.file) {
        thumbnail_file_id = this.fileRepo.create({
          dosen_id: null,
          mahasiswa_id: null,
          mimetype: req.file!.mimetype,
          random_name: req.file.path.replace(Bun.env.UPLOAD_PATH || "", ""),
          size: req.file!.size,
          upload_name: req.file!.originalname,
        });
      }

      if (!title || !thumbnail_file_id || !content) {
        return res.status(400).json({
          code: 400,
          error: {
            message: "Title, thumbnail_file_id, and content are required",
            code: "VALIDATION_ERROR",
          },
        } as ErrorResponse);
      }

      const newsData = {
        title,
        thumbnail_file_id: Number(thumbnail_file_id),
        content,
      };

      const createdNews = this.newsService.create(newsData);

      res.status(201).json({
        code: 201,
        data: createdNews,
      } as SuccessResponse<News>);
    } catch (error) {
      res.status(500).json({
        code: 500,
        error: {
          message: (error as Error).message || "Internal server error",
          code: "INTERNAL_ERROR",
        },
      } as ErrorResponse);
    }
  }

  update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);

      if (isNaN(id)) {
        return res.status(400).json({
          code: 400,
          error: {
            message: "Invalid news ID",
            code: "VALIDATION_ERROR",
          },
        } as ErrorResponse);
      }

      const current = this.newsService.getById(id);
      if (!current) {
        return res.status(404).json({
          code: 404,
          error: {
            message: "News not found",
            code: "NOT_FOUND",
          },
        } as ErrorResponse);
      }

      const { title, content } = req.body;
      let thumbnail_file_id: number | null = null;
      if (req.file) {
        thumbnail_file_id = this.fileRepo.create({
          dosen_id: null,
          mahasiswa_id: null,
          mimetype: req.file!.mimetype,
          random_name: req.file.path.replace(Bun.env.UPLOAD_PATH || "", ""),
          size: req.file!.size,
          upload_name: req.file!.originalname,
        });

        const oldFile = this.fileRepo.findById(current.thumbnail_file_id);
        if (oldFile) {
          this.fileRepo.delete(current.thumbnail_file_id);
          Bun.file(`${Bun.env.UPLOAD_PATH}/${oldFile?.random_name}`).delete();
        }
      }

      const updateData: any = {};
      if (title) updateData.title = title;
      if (thumbnail_file_id)
        updateData.thumbnail_file_id = Number(thumbnail_file_id);
      if (content) updateData.content = content;

      const updatedNews = this.newsService.update(id, updateData);

      res.json({
        code: 200,
        data: updatedNews,
      } as SuccessResponse<News>);
    } catch (error) {
      res.status(500).json({
        code: 500,
        error: {
          message: (error as Error).message || "Internal server error",
          code: "INTERNAL_ERROR",
        },
      } as ErrorResponse);
    }
  }

  delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);

      if (isNaN(id)) {
        return res.status(400).json({
          code: 400,
          error: {
            message: "Invalid news ID",
            code: "VALIDATION_ERROR",
          },
        } as ErrorResponse);
      }

      const current = this.newsService.getById(id);
      if (!current) {
        return res.status(404).json({
          code: 404,
          error: {
            message: "News not found",
            code: "NOT_FOUND",
          },
        } as ErrorResponse);
      }

      const deletedNews = this.newsService.delete(id);
      const oldFile = this.fileRepo.findById(current.thumbnail_file_id);
      if (oldFile) {
        this.fileRepo.delete(current.thumbnail_file_id);
        Bun.file(`${Bun.env.UPLOAD_PATH}/${oldFile?.random_name}`).delete();
      }

      res.json({
        code: 200,
        data: deletedNews,
      } as SuccessResponse<News>);
    } catch (error) {
      res.status(500).json({
        code: 500,
        error: {
          message: (error as Error).message || "Internal server error",
          code: "INTERNAL_ERROR",
        },
      } as ErrorResponse);
    }
  }
}
