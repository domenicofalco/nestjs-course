import {
  IsString,
  IsNumber,
  Min,
  Max,
  IsLongitude,
  IsLatitude,
} from 'class-validator';

export class CreateReportDto {
  @IsString()
  make: string;

  @IsString()
  model: string;

  @IsLongitude()
  lng: number;

  @IsLatitude()
  lat: number;

  @IsNumber()
  @Min(0)
  @Max(10000000)
  price: number;

  @IsNumber()
  @Min(0)
  @Max(10000000)
  km: number;

  @IsNumber()
  @Min(1930)
  @Max(2050)
  year: number;
}
