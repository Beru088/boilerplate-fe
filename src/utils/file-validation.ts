export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/')
}

export function isImageMimeType(mimeType: string): boolean {
  return mimeType.startsWith('image/')
}

export function getImageFiles(files: File[]): File[] {
  return files.filter(isImageFile)
}

export function validateCoverSelection(
  files: File[],
  positionArray: Array<{ id: number | null; position: number; isCover: boolean }>
): { isValid: boolean; errorMessage?: string } {
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const positionData = positionArray.find(pos => pos.position === i)

    if (positionData?.isCover && !isImageFile(file)) {
      return {
        isValid: false,
        errorMessage: `Cover can only be set on image files. "${file.name}" is not an image.`
      }
    }
  }

  return { isValid: true }
}

export function validateCoverRequirement(
  files: File[],
  positionArray: Array<{ id: number | null; position: number; isCover: boolean }>
): { isValid: boolean; errorMessage?: string } {
  const hasCover = positionArray.some(pos => pos.isCover)
  const hasImages = files.some(isImageFile)

  if (hasCover && !hasImages) {
    return {
      isValid: false,
      errorMessage: 'Cover can only be set when at least one image file is provided.'
    }
  }

  return { isValid: true }
}

export function validateCoverRestrictions(
  files: File[],
  positionArray: Array<{ id: number | null; position: number; isCover: boolean }>
): { isValid: boolean; errorMessage?: string } {
  const coverSelectionValidation = validateCoverSelection(files, positionArray)
  if (!coverSelectionValidation.isValid) {
    return coverSelectionValidation
  }

  const coverRequirementValidation = validateCoverRequirement(files, positionArray)
  if (!coverRequirementValidation.isValid) {
    return coverRequirementValidation
  }

  const hasImages = files.some(isImageFile)
  const hasCover = positionArray.some(pos => pos.isCover)

  if (hasImages && !hasCover) {
    return {
      isValid: false,
      errorMessage: 'At least one image must be set as cover.'
    }
  }

  return { isValid: true }
}

export function validateCoverRestrictionsWithExisting(
  files: File[],
  positionArray: Array<{ id: number | null; fileKey: string | null; position: number; isCover: boolean }>,
  existingMedia?: Array<{ id: number; mime: string; isCover: boolean }>,
  deleteMediaIds: number[] = []
): { isValid: boolean; errorMessage?: string } {
  const coverSelectionValidation = validateCoverSelection(files, positionArray)
  if (!coverSelectionValidation.isValid) {
    return coverSelectionValidation
  }

  const hasCoverInNewFiles = positionArray.some(pos => pos.id === null && pos.isCover)
  const hasCoverInExistingMedia =
    existingMedia?.some(media => !deleteMediaIds.includes(media.id) && media.isCover && isImageMimeType(media.mime)) ||
    false

  const hasAnyCover = hasCoverInNewFiles || hasCoverInExistingMedia

  const hasImagesInNewFiles = files.some(isImageFile)
  const hasImagesInExistingMedia =
    existingMedia?.some(media => !deleteMediaIds.includes(media.id) && isImageMimeType(media.mime)) || false

  const hasAnyImages = hasImagesInNewFiles || hasImagesInExistingMedia

  if (hasAnyCover && !hasAnyImages) {
    return {
      isValid: false,
      errorMessage: 'Cover can only be set when at least one image file is available.'
    }
  }

  if (hasAnyImages && !hasAnyCover) {
    return {
      isValid: false,
      errorMessage: 'At least one image must be set as cover.'
    }
  }

  return { isValid: true }
}
