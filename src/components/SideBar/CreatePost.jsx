import { Box, Button, Flex, Input, Textarea, Image } from "@chakra-ui/react";
import { Tooltip } from "../Misc/tooltip";
import { CreatePostLogo } from "../../assets/constants";
import {
  DialogContent,
  DialogHeader,
  DialogCloseTrigger,
  DialogFooter,
  DialogBody,
  DialogRoot,
  DialogTrigger,
} from "../../components/Misc/dialog";
import { BsFillImageFill } from "react-icons/bs";
import { useRef, useState } from "react";
import usePreviewImg from "../../hooks/usePreviewImg";
import { CloseButton } from "../Misc/close-button";
import useShowToast from "../../hooks/useShowToast";
import useAuthStore from "../../store/authStore";
import usePostStore from "../../store/postStore";
import useUserProfileStore from "../../store/userProfileStore";
import { useLocation } from "react-router-dom";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  updateDoc,
} from "firebase/firestore";
import { firestore, storage } from "../../firebase/firebase";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import imageCompression from "browser-image-compression";

const CreatePost = () => {
  const [caption, setCaption] = useState("");
  const imageRef = useRef(null);
  const { handleImageChange, selectedFile, setSelectedFile } = usePreviewImg();
  const { isLoading, handleCreatePost } = useCreatePost();
  const showToast = useShowToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handlePostCreation = async () => {
    try {
      await handleCreatePost(selectedFile, caption);
      setIsDialogOpen(false);
      setCaption("");
      setSelectedFile(null);
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  return (
    <>
      <Tooltip
        hasArrow
        label={"Create"}
        placement="right"
        ml={1}
        openDelay={500}
        display={{ base: "block", md: "none" }}
      >
        <DialogRoot
          motionPreset={"slide-in-left"}
          onOpenChange={setIsDialogOpen}
        >
          <DialogTrigger asChild>
            <Flex
              alignItems={"center"}
              gap={4}
              _hover={{ bg: "whiteAlpha.400" }}
              borderRadius={6}
              p={2}
              w={{ base: 10, md: "full" }}
              justifyContent={{ base: "center", md: "flex-start" }}
              onClick={() => setIsDialogOpen(true)}
            >
              <CreatePostLogo />
              <Box display={{ base: "none", md: "block" }}>Create</Box>
            </Flex>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>Create Post</DialogHeader>
            <DialogCloseTrigger />
            <DialogBody>
              <Textarea
                placeholder="Post caption..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
              <Input
                type="file"
                hidden
                ref={imageRef}
                onChange={handleImageChange}
              />
              <BsFillImageFill
                style={{
                  marginTop: "15px",
                  marginLeft: "5px",
                  cursor: "pointer",
                }}
                size={16}
                onClick={() => imageRef.current.click()}
              />
              {selectedFile && (
                <Flex
                  mt={5}
                  width={"full"}
                  position={"relative"}
                  justifyContent={"center"}
                >
                  <Image src={selectedFile} alt="Selected img" />
                  <CloseButton
                    position={"absolute"}
                    top={2}
                    right={2}
                    onClick={() => {
                      setSelectedFile("");
                    }}
                  />
                </Flex>
              )}
            </DialogBody>
            <DialogFooter>
              <Button mr={3} onClick={handlePostCreation} isLoading={isLoading}>
                Post
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogRoot>
      </Tooltip>
    </>
  );
};

export default CreatePost;

function useCreatePost() {
  const showToast = useShowToast();
  const [isLoading, setIsLoading] = useState(false);
  const authUser = useAuthStore((state) => state.user);
  const createPost = usePostStore((state) => state.createPost);
  const addPost = useUserProfileStore((state) => state.addPost);
  const userProfile = useUserProfileStore((state) => state.userProfile);
  const { pathname } = useLocation();

  const handleCreatePost = async (selectedFile, caption) => {
    if (isLoading) return;
    if (!selectedFile) {
      throw new Error("Please select an image");
    }
    setIsLoading(true);

    const newPost = {
      caption: caption,
      likes: [],
      comments: [],
      createdAt: Date.now(),
      createdBy: authUser.uid,
    };
    try {
      const postDocRef = await addDoc(collection(firestore, "posts"), newPost);
      const userDocRef = doc(firestore, "users", authUser.uid);

      const originalImageRef = ref(storage, `posts/${postDocRef.id}_original`);
      const compressedImageRef = ref(
        storage,
        `posts/${postDocRef.id}_compressed`
      );

      // Convert base64 to File
      const originalFile = dataURLtoFile(selectedFile);

      // Upload Original Image
      await uploadString(originalImageRef, selectedFile, "data_url");
      const originalDownloadURL = await getDownloadURL(originalImageRef);

      // Compress the image
      const compressedFile = await imageCompression(originalFile, {
        maxSizeMB: 0.2,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      });

      // Convert compressed file back to base64
      const compressedDataURL = await fileToDataURL(compressedFile);

      // Upload Compressed Image
      await uploadString(compressedImageRef, compressedDataURL, "data_url");
      const compressedDownloadURL = await getDownloadURL(compressedImageRef);

      // Update Firestore with both image URLs
      await updateDoc(postDocRef, {
        originalImageURL: originalDownloadURL,
        compressedImageURL: compressedDownloadURL,
      });

      // Add URLs to local post object
      newPost.originalImageURL = originalDownloadURL;
      newPost.compressedImageURL = compressedDownloadURL;

      // Update UI Store
      if (userProfile.uid === authUser.uid)
        createPost({ ...newPost, id: postDocRef.id });
      if (pathname !== "/" && userProfile.uid === authUser.uid)
        addPost({ ...newPost, id: postDocRef.id });

      showToast("Success", "Post created successfully", "success");
    } catch (error) {
      console.log(error);
      showToast("Error", error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, handleCreatePost };
}

const dataURLtoFile = (dataurl) => {
  let arr = dataurl.split(",");
  let mime = arr[0].match(/:(.*?);/)[1];
  let bstr = atob(arr[1]);
  let n = bstr.length;
  let u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], "image", { type: mime });
};

const fileToDataURL = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
