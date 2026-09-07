import { useEffect } from 'react';

interface ErrorPageProps {
  code: number;
  title: string;
  message: string;
  lottieSrc?: string;
}

const errorConfig: Record<string, ErrorPageProps> = {
  '400': {
    code: 400,
    title: 'Prokope | Unexpected Problem',
    message: 'Sorry, something unexpected happened. Please try again later.',
    lottieSrc: 'https://lottie.host/9c2c19f7-9b81-463f-a47a-7c90425f1f90/Qbzk1DIKrd.lottie',
  },
  '403': {
    code: 403,
    title: 'Prokope | Permission Denied',
    message: 'You do no have permission to take that action.',
    lottieSrc: 'https://lottie.host/9c2c19f7-9b81-463f-a47a-7c90425f1f90/Qbzk1DIKrd.lottie',
  },
  '404': {
    code: 404,
    title: 'Prokope | Nonexistent Page',
    message: 'Sorry, page does not exist.',
    lottieSrc: 'https://lottie.host/32e4ac41-5cb1-4b63-a586-890bae2f9ee6/h0dnLwg0aS.lottie',
  },
  '500': {
    code: 500,
    title: 'Prokope | Server Issue',
    message: 'Sorry, the server is having trouble processing your request.',
    lottieSrc: 'https://lottie.host/9c2c19f7-9b81-463f-a47a-7c90425f1f90/Qbzk1DIKrd.lottie',
  },
};

export default function ErrorPage({ code = 404 }: { code?: number }) {
  const config = errorConfig[String(code)] || errorConfig['404'];

  useEffect(() => {
    document.title = config.title;
  }, [config.title]);

  return (
    <div className="mb-4">
      <div className="container text-center justify-content-center col-md-12 col-sm-12">
        <h1 className="m-3">{config.message}</h1>
        {config.lottieSrc && (
          <dotlottie-player
            className="mx-auto"
            src={config.lottieSrc}
            background="transparent"
            speed={1}
            style={{ width: 300, height: 300 }}
            loop
            autoplay
          ></dotlottie-player>
        )}
      </div>
    </div>
  );
}
