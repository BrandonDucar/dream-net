/**
 * @dreamnet/star-bridge-lungs (respiratory) — Re-exports from digestive/star-bridge-lungs
 * Both organs share the same Star Bridge for data I/O flow.
 */
export { 
  connect, 
  reportIngestion, 
  reportTransform, 
  shareContent, 
  broadcastDiscovery, 
  bridge 
} from '../../digestive/star-bridge-lungs/index.js';
