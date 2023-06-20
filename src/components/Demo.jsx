import { useState, useEffect } from "react";
import { copy, linkIcon, loader, tick } from "../assets/index.js";
import { useLazyGetSummaryQuery } from "../services/article";
//
const Demo = () => {
    const [article, setArticle] = useState({
        url: "",
        summary: "",
    });
    const [allArticles, setAllArticles] = useState([]);
    useEffect(() => {
        const storedArticles = JSON.parse(localStorage.getItem("articles"));
        if (storedArticles) {
            setAllArticles(storedArticles);
        }
    }, []);
    const [copied, setCopied] = useState("");
    const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!article.url) {
            return;
        }
        const filterArticles = allArticles.filter(
            (item) => item.url === article.url
        );
        if (filterArticles.length > 0) {
            setArticle(filterArticles[0]);
            const newArticle = { ...filterArticles[0] };
            const updateAllAritcles = [newArticle, ...allArticles];
            setAllArticles(updateAllAritcles);
            localStorage.setItem("articles", JSON.stringify(updateAllAritcles));
        } else {
            const { data } = await getSummary({
                articleUrl: article.url,
            });
            if (data?.summary) {
                const newArticle = {
                    ...article,
                    summary: data.summary,
                };
                const updateAllAritcles = [newArticle, ...allArticles];
                setArticle(newArticle);
                setAllArticles(updateAllAritcles);
                localStorage.setItem(
                    "articles",
                    JSON.stringify(updateAllAritcles)
                );
            }
        }
    };
    const handleCopy = (copyUrl) => {
        setCopied(copyUrl);
        window.navigator.clipboard.writeText(copyUrl);
        setTimeout(() => {
            setCopied("");
        }, 3000);
    };
    const handleDeleteArticle = (deleteUrl) => {
        const updateAllArticles = allArticles.filter(
            (item) => item.url !== deleteUrl
        );
        setAllArticles(updateAllArticles);
        localStorage.setItem("articles", JSON.stringify(updateAllArticles));
    };
    return (
        <section className="flex flex-col gap-2 w-full my-4">
            <div className=" flex flex-col gap-2 w-full">
                {/* search box */}
                <form
                    onSubmit={handleSubmit}
                    className={
                        "relative w-full flex justify-center items-center " +
                        (isFetching && "readOnly_input")
                    }
                >
                    <img
                        src={linkIcon}
                        alt=""
                        className="absolute left-0 w-6 object-contain mx-2"
                    />
                    <input
                        type="url"
                        className={"url_input peer text-gray-600 py-4 "}
                        value={article.url}
                        required
                        placeholder="Enter the url here"
                        onChange={(e) =>
                            setArticle({ ...article, url: e.target.value })
                        }
                    ></input>
                    <button
                        className="submit_btn 
                        peer-focus:border-gray-700
                        peer-focus:text-gray-700"
                    >
                        ←
                    </button>
                </form>
                {/* Browser URL history*/}
                <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
                    {allArticles.map((item, index) => (
                        <div
                            key={`link-${index}`}
                            onClick={() => setArticle(item)}
                            className="link_card relative flex items-center"
                        >
                            <div
                                className="copy_btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleCopy(item.url);
                                }}
                            >
                                <img
                                    src={copied === item.url ? tick : copy}
                                    alt="copy"
                                    className="w-[40%] h-[40%] object-contain"
                                />
                            </div>
                            <p className="flex-1 font-satoshi text-blue-500 font-medium text-sm truncate">
                                {item.url}
                            </p>

                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleDeleteArticle(item.url);
                                }}
                                className="absolute right-0 text-red-300 text-base px-1 mr-1"
                            >
                                X
                            </button>
                        </div>
                    ))}
                    {allArticles.length > 0 && (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                setAllArticles([]);
                                localStorage.setItem(
                                    "articles",
                                    JSON.stringify([])
                                );
                            }}
                            className="mt-3 text-red-500 font-medium"
                        >
                            CLear all history
                        </button>
                    )}
                </div>
            </div>
            {/* Show result */}
            <div className="flex max-w-full my-10 flex-col gap-2 justify-center items-center">
                {isFetching ? (
                    <img
                        src={loader}
                        alt="loader"
                        className="w-20 object-contain"
                    />
                ) : error ? (
                    <div>
                        It wasn't supposed to happen...
                        <br />
                        <span className="text-red-600">
                            {error?.data?.error}
                        </span>
                    </div>
                ) : (
                    article.summary && (
                        <div className="w-full flex flex-col gap-3">
                            <h2 className="font-satoshi font-bold text-gray-600 text-xl">
                                Article
                                <span className="blue_gradient"> Summary</span>
                                <div className="summary_box my-4">
                                    <p className="text-justify font-inter font-medium text-sm text-gray-700">
                                        {article.summary}
                                    </p>
                                </div>
                            </h2>
                        </div>
                    )
                )}
            </div>
        </section>
    );
};

export default Demo;
