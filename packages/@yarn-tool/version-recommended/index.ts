import { nextVersionRecommended } from './lib/nextVersionRecommended';
import { nextVersionRecommendedByWorkspacesProject, nextVersionRecommendedByWorkspacesFindUp } from './lib/ws';
import { nextVersionRecommendedByPackage, nextVersionRecommendedByPackageFindUp } from './lib/pkg';

export * from './lib/types';

export { nextVersionRecommended }
export { nextVersionRecommendedByWorkspacesFindUp }
export { nextVersionRecommendedByWorkspacesProject }

export { nextVersionRecommendedByPackage }
export { nextVersionRecommendedByPackageFindUp }

export default nextVersionRecommendedByPackageFindUp
