import { Link } from "wouter";
import { formatDate } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface BlogCardProps {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  category: string;
  readTime?: string;
  createdAt: string | Date;
}

const BlogCard = ({ 
  id, 
  title, 
  slug, 
  excerpt, 
  coverImage, 
  category, 
  readTime = "5 min de leitura", 
  createdAt 
}: BlogCardProps) => {
  return (
    <Card className="overflow-hidden">
      <img 
        src={coverImage} 
        alt={title} 
        className="w-full h-48 object-cover"
      />
      <CardContent className="p-6">
        <p className="text-sm text-indigo-600 font-medium mb-1">{category}</p>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          <Link href={`/blog/${slug}`}>
            <a className="hover:text-indigo-600 transition-colors">{title}</a>
          </Link>
        </h3>
        <p className="text-gray-600 mb-4">{excerpt}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">{readTime}</span>
          <Link href={`/blog/${slug}`}>
            <a className="text-indigo-600 hover:text-indigo-800 font-medium">Ler mais</a>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogCard;
