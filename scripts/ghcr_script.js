require("dotenv").config();
const axios = require("axios");

const USER = process.env.USER;
const IMAGE = process.env.IMAGE_FRONTEND;
const GHCR_TOKEN = Buffer.from(process.env.GITHUB_TOKEN).toString("base64");

const ghcrApi = axios.create({
  baseURL: `https://ghcr.io/v2/${USER}/${IMAGE}`,
  headers: {
    Authorization: `Bearer ${GHCR_TOKEN}`,
    "Content-Type": "application/vnd.docker.distribution.manifest.v2+json",
  },
});

// List tags
const listTags = async () => {
  try {
    const response = await ghcrApi.get("/tags/list");
    console.log("Tags:", response.data);
  } catch (error) {
    console.error("Error listing tags:", error.response?.data || error.message);
  }
};

// Pull manifest for a tag
const getManifest = async (tag) => {
  try {
    const response = await ghcrApi.get(`/manifests/${tag}`);
    console.log(`Manifest for ${tag}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching manifest for ${tag}:`, error.response?.data || error.message);
  }
};

// Push a new tag
const pushTag = async (oldTag, newTag) => {
  try {
    const manifest = await getManifest(oldTag);
    if (!manifest) return;

    await ghcrApi.put(`/manifests/${newTag}`, manifest);
    console.log(`Successfully pushed new tag: ${newTag}`);
  } catch (error) {
    console.error(`Error pushing new tag:`, error.response?.data || error.message);
  }
};

// Delete an image tag from GHCR
const deleteImage = async (tag) => {
  try {
    // Get manifest digest
    const manifest = await getManifest(tag);
    if (!manifest || !manifest.config || !manifest.config.digest) {
      console.error(`Could not retrieve manifest digest for ${tag}`);
      return;
    }

    const digest = manifest.config.digest;
// /orgs/{org}/packages/{package_type}/{package_name}
    // Delete request
    
    const deleteUrl = `https://api.github.com/${USER}/packages/docker/${digest}`;
    const deleteResponse = await axios.delete(deleteUrl, {
      headers: {
        Authorization: `Bearer ${GHCR_TOKEN}`,
        'X-GitHub-Api-Version': '2022-11-28'
      },
    });

    console.log(`Deleted tag ${tag} successfully!`);
  } catch (error) {
    console.error(`Error deleting tag ${tag}:`, error.response?.data || error.message);
  }
};

// Run functions
listTags();
getManifest("latest");
// pushTag("test", "latest");
deleteImage("latest"); // Uncomment to delete the "latest" tag
