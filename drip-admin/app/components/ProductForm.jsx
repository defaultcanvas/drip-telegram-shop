"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { v4 as uuid } from "uuid";

export default function ProductForm({ mode, product }) {
  const editing = mode === "edit";

  const [title, setTitle] = useState(product?.title || "");
  const [brand, setBrand] = useState(product?.brand || "");
  const [category, setCategory] = useState(product?.category || "");
  const [subcategory, setSubcategory] = useState(product?.subcategory || "");
  const [description, setDescription] = useState(product?.description || "");
  const [price, setPrice] = useState(product?.price_gbp || "");
  const [sizes, setSizes] = useState(product?.sizes || ["S","M","L","XL"]);
  const [images, setImages] = useState(product?.product_images || []);
  const [uploading, setUploading] = useState(false);

  async function uploadImages(files) {
    setUploading(true);

    const uploads = [];

    for (let file of files) {
      const id = uuid();
      const path = `${id}-${file.name}`;
      
      let { data, error } = await supabase.storage
        .from("product-images")
        .upload(path, file, { upsert: false });

      if (!error) {
        const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${path}`;
        uploads.push(url);
      }
    }

    setUploading(false);
    return uploads;
  }

  async function save() {
    const imgFiles = document.getElementById("image-upload").files;
    let newImageUrls = [];

    if (imgFiles.length > 0) {
      newImageUrls = await uploadImages(imgFiles);
    }

    let base = {
      title,
      brand,
      category,
      subcategory,
      description,
      price_gbp: price,
      sizes,
    };

    let prod;

    if (!editing) {
      let { data } = await supabase.from("products").insert(base).select().single();
      prod = data;
    } else {
      let { data } = await supabase.from("products").update(base).eq("id", product.id).select().single();
      prod = data;
    }

    // Insert uploaded images
    for (let i = 0; i < newImageUrls.length; i++) {
      await supabase.from("product_images").insert({
        product_id: prod.id,
        image_url: newImageUrls[i],
        position: i,
        is_primary: i === 0,
      });
    }

    alert("Saved!");
    window.location.href = "/admin/products";
  }

  return (
    <div className="space-y-6 max-w-2xl">
      
      <Input label="Title" value={title} set={setTitle} />
      <Input label="Brand" value={brand} set={setBrand} />
      <Input label="Category" value={category} set={setCategory} />
      <Input label="Subcategory" value={subcategory} set={setSubcategory} />
      <Input label="Description" value={description} set={setDescription} textarea />
      <Input label="Price (GBP)" value={price} set={setPrice} />

      <div>
        <label className="block mb-2 text-white/60">Upload Images</label>
        <input id="image-upload" type="file" multiple className="w-full" />
        {uploading && <div className="text-yellow-400 mt-2">Uploading...</div>}
      </div>

      <button
        onClick={save}
        className="px-6 py-3 bg-yellow-400 text-black rounded-xl font-semibold hover:bg-yellow-300"
      >
        Save Product
      </button>
    </div>
  );
}

function Input({ label, value, set, textarea }) {
  return (
    <label className="block">
      <span className="text-white/60">{label}</span>
      {textarea ? (
        <textarea
          className="w-full bg-white/10 p-3 rounded-xl mt-1"
          value={value}
          onChange={(e) => set(e.target.value)}
        />
      ) : (
        <input
          className="w-full bg-white/10 p-3 rounded-xl mt-1"
          value={value}
          onChange={(e) => set(e.target.value)}
        />
      )}
    </label>
  );
}