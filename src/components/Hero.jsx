import { logo } from "../assets/index.js";

//
const Hero = () => {
    return (
        <header className="w-full flex flex-col justify-center items-center">
            <nav className="w-full pt-4 flex justify-between mb-12 ">
                <img
                    src={logo}
                    alt="The AI Summarizer logo"
                    className="w-28 object-contain"
                />
                <button
                    className="black_btn"
                    onClick={() => {
                        window.open("https://github.com/cuonglexuan203/");
                    }}
                >
                    Github
                </button>
            </nav>
            {/* Discription */}
            <h1 className="head_text">
                Summarize Articles with
                <br className="max-md:hidden" />
                <span className="orange_gradient"> OpenAI GPT-4</span>
            </h1>
            <h2 className="desc block text-justify my-4">
                Simplify your reading with Summize, an open-source articles
                summarizer that transforms length articles into clear and
                concise summarizes
            </h2>
        </header>
    );
};

export default Hero;
