import NewsFilter from "@/components/ui/News/NewsFilter";
import NewsCards from "@/components/ui/News/NewsCards";


export default function NewsPage() {

  return (
    <div className="w-full mt-6 px-8 md:px-16">
      <NewsFilter/>
      <NewsCards/>
    </div>
  );
}