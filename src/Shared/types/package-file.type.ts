export enum PackageFileName {
  PACKAGE_JSON = 'package.json',
  COMPOSER_JSON = 'composer.json',
}

export enum PackageFileType {
  JSON = 'JSON',
}

export enum PackageFileRegistry {
  NPM = 'NPM',
  PACKAGIST = 'PACKAGIST',
}

export type PackageFile = {
  type: PackageFileType;
  filename: PackageFileName;
  registry: PackageFileRegistry;
};
