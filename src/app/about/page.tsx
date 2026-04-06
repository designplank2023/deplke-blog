import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '소개',
  description: '디자인플랜케이에 대해 알아보세요.',
  openGraph: {
    title: '소개',
    description: '디자인플랜케이에 대해 알아보세요.',
    type: 'website',
  },
};

export default function AboutPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12 sm:py-16">
        <div className="container-main">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            우리에 대해
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            디자인플랜케이(DEPLKE)의 이야기
          </p>
        </div>
      </section>

      {/* Content */}
      <article className="container-main section-padding">
        <div className="max-w-3xl mx-auto prose dark:prose-invert">
          <h2>우리는 누구인가요?</h2>
          <p>
            디자인플랜케이(DEPLKE)는 AI, 개발, 교육, 광고, 마케팅, 커리어에 대한 최신 정보와 인사이트를 공유하는 기술 블로그입니다.
            우리는 믿습니다. 기술은 누구나 접근할 수 있어야 하며, 지식 공유를 통해 함께 성장할 수 있다고.
          </p>

          <h2>우리의 미션</h2>
          <p>
            고품질의 기술 콘텐츠를 통해 개발자, 디자이너, 마케터, 그리고 기술에 관심 있는 모든 사람들에게
            가치 있는 정보를 제공하는 것입니다.
          </p>

          <h2>주요 주제</h2>
          <ul>
            <li><strong>AI 및 머신러닝</strong> - 최신 AI 기술과 활용 방법</li>
            <li><strong>개발</strong> - 웹, 모바일, 백엔드 개발 기술</li>
            <li><strong>교육</strong> - 기술 학습과 자기계발</li>
            <li><strong>광고 및 마케팅</strong> - 디지털 마케팅 전략</li>
            <li><strong>커리어</strong> - 기술 산업의 진로 및 경력 개발</li>
          </ul>

          <h2>우리의 약속</h2>
          <p>
            모든 글은 신뢰할 수 있는 정보를 바탕으로 작성되며, 최신 트렌드를 반영합니다.
            독자들과의 상호작용을 소중히 여기고, 지속적으로 피드백을 받아 개선하겠습니다.
          </p>

          <h2>연락하기</h2>
          <p>
            질문, 제안, 또는 협업에 대해 궁금하신 사항이 있으신가요?
          </p>
          <p>
            <a href="mailto:info@deplke.com">info@deplke.com</a>으로 문의해주세요.
          </p>

          <h2>소셜 미디어</h2>
          <p>
            우리를 팔로우하고 최신 소식을 받아보세요.
          </p>
          <ul>
            <li>
              <a href="https://twitter.com/deplke" target="_blank" rel="noopener noreferrer">
                Twitter
              </a>
            </li>
            <li>
              <a href="https://github.com/deplke" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </li>
            <li>
              <a href="https://www.linkedin.com/company/deplke" target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </article>

      {/* CTA Section */}
      <section className="bg-gray-50 dark:bg-gray-900 section-padding">
        <div className="container-main text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            최신 글을 구독하세요
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            새로운 글이 발행되면 이메일로 알려드립니다.
          </p>
          <form className="flex max-w-md mx-auto gap-2">
            <input
              type="email"
              placeholder="이메일을 입력하세요"
              className="flex-1 px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              required
            />
            <button type="submit" className="btn-primary">
              구독
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
