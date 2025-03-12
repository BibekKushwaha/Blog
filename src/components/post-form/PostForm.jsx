/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

export default function PostForm({ post }) {
  const { register, handleSubmit, watch, setValue, control, getValues } =
    useForm({
      defaultValues: {
        title: post?.title || "",
        slug: post?.$id || "",
        content: post?.content || "",
        status: post?.status || "active",
      },
    });
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      setValue("image", imageUrl);
    }
  };

  // const handleImageChange = (e) => {
  //     const file = e.target.files[0];
  //     if (file) {
  //         const imageUrl = URL.createObjectURL(file);
  //         setImagePreview(imageUrl);
  //     }
  // };

  console.log("imagePreview::", imagePreview);
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const dispatch = useDispatch();
  const submit = async (data) => {
    console.log(data);

    if (post) {
      const file =
        data.image && data.image[0]
          ? await appwriteService.uploadFile(data.image[0])
          : null;

      if (file) {
        appwriteService.deleteFile(post.featuredImage);
      }

      const dbPost = await appwriteService.updatePost(post.$id, {
        featuredImage: file ? file.$id : undefined,
        ...data,
      });

      if (dbPost) {
        navigate(`/post/${dbPost.$id}`);
      }
    } else {
      // dispatch(createBlogPost({...data}));
      const file =
        data.image && data.image[0]
          ? await appwriteService.uploadFile(data.image[0])
          : null;
      console.log(userData.$id);

      if (file) {
        const fileId = file.$id;
        data.featuredImage = fileId;
        const dbPost = await appwriteService.createPost({
          userid: userData ? userData.$id : null,
          ...data,
        });

        if (dbPost) {
          navigate(`/post/${dbPost.$id}`);
        }
      }
    }
  };

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string")
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]+/g, "-")
        .replace(/\s/g, "-");

    return "";
  }, []);

  React.useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), { shouldValidate: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue]);

  const selectedFile = watch("image");

  useEffect(() => {
    if (selectedFile && selectedFile[0]) {
      const imageUrl = URL.createObjectURL(selectedFile[0]);
      setImagePreview(imageUrl);
    }
  }, [selectedFile]);

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
      <div className="w-2/3 px-2">
        <Input
          label="Title :"
          placeholder="Title"
          className="mb-4"
          {...register("title", { required: true })}
        />
        <Input
          label="Slug :"
          placeholder="Slug"
          className="mb-4"
          {...register("slug", { required: true })}
          onInput={(e) => {
            setValue("slug", slugTransform(e.currentTarget.value), {
              shouldValidate: true,
            });
          }}
        />
        <RTE
          label="Content :"
          name="content"
          control={control}
          defaultValue={getValues("content")}
        />
      </div>
      <div className="w-1/3 px-2">
        <Input
          label="Featured Image :"
          type="file"
          className="mb-4"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          onChange={handleImageChange}
          {...register("image", {
            required: !post,
            validate: {
              fileSize: (file) =>
                file[0]?.size <= 5 * 1024 * 1024 ||
                "File size must be less than 5MB",
              fileType: (file) =>
                ["image/png", "image/jpg", "image/jpeg", "image/gif"].includes(
                  file[0]?.type
                ) || "Invalid file type",
            },
          })}
        />

        {post && (
          <div className="w-full mb-4">
            <img
              src={appwriteService.getFilePreview(post.featuredImage)}
              alt={post.title}
              className="rounded-lg"
            />
          </div>
        )}
        {!post && imagePreview && (
          <div className="w-full mb-4">
            <img src={imagePreview} className="rounded-lg" />
          </div>
        )}
        <Select
          options={["active", "inactive"]}
          label="Status"
          className="mb-4"
          {...register("status", { required: true })}
        />
        <Button
          type="submit"
          bgColor={post ? "bg-green-500" : undefined}
          className="w-full"
        >
          {post ? "Update" : "Submit"}
        </Button>
      </div>
    </form>
  );
}