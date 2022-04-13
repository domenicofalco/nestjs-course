import { Expose, Transform } from 'class-transformer';

export class ReportDto {
  @Expose()
  id: number;

  @Expose()
  prince: number;

  @Expose()
  year: number;

  @Expose()
  make: string;

  @Expose()
  model: string;

  @Expose()
  lat: number;

  @Expose()
  km: number;

  @Expose()
  lng: number;

  @Transform(({ obj: report }) => report.user.id)
  @Expose()
  userId: number;

  @Expose()
  approved: boolean;
}
