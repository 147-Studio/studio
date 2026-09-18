import React from "react";
import styles from "./styles.module.scss";
import Countdown from "react-countdown";
import Copy from "@/components/ui/text/copy";
import { DotMatrix } from "dot-anime-react";
import { courses_link } from "@/config/course";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { scale } from "framer-motion";

const Payment = () => {
  const isMobile = useMediaQuery("(max-width: 767px)");
  return (
    <div className={styles.container}>
      <div className={styles.date_wrapper}>
        <div className={styles.date}>
          <div className={styles.heading}>
            <div className={styles.dot} />
            <Copy>
              <span>زمان باقی مانده تا پایان ثبت نام</span>
            </Copy>
            <div className={styles.dot} />
          </div>

          <div className={styles.countdown_wrapper}>
            <Countdown
              date={new Date("2026-06-28T20:00:00+03:30")}
              renderer={({ days, hours, minutes, seconds }) => (
                <div className={styles.timer}>
                  <DigitPair value={days} />
                  <Space />
                  <DigitPair value={hours} />
                  <Space />
                  <DigitPair value={minutes} />
                  <Space />
                  <DigitPair value={seconds} />
                </div>
              )}
            />
            <div className={styles.count}>
              <span>ثانیه</span>
              <span>دقیقه</span>
              <span>ساعت</span>
              <span>روز</span>
            </div>
          </div>
        </div>
      </div>
      {isMobile ? <PaymentMethodMobile /> : <PaymentMethodDesktop />}
    </div>
  );
};

export default Payment;

const Detail = ({ detail }: { detail: (typeof details)[number] }) => {
  return (
    <div className={styles.detail_wrapper}>
      <img src={detail.icon} />
      <div className={styles.detail}>
        <span className={styles.title}>{detail.title}</span>
        <span className={styles.subtitle}>{detail.subtitle}</span>
      </div>
    </div>
  );
};
const DigitPair = ({ value }: { value: number }) => {
  const str = String(value).padStart(2, "0");

  return (
    <div className={styles.pair}>
      <LeftDigit digit={str[0]} />
      <RightDigit digit={str[1]} />
    </div>
  );
};

const LeftDigit = ({ digit }: { digit: string }) => {
  return (
    <DotMatrix
      sequence={[LeftDIGITS[digit]]}
      cols={5}
      rows={7}
      dotSize={8}
      gap={2}
      shape="circle"
      color="#fff"
      inactiveColor="rgba(255,255,255,.06)"
    />
  );
};

const RightDigit = ({ digit }: { digit: string }) => {
  return (
    <DotMatrix
      sequence={[RightDIGITS[digit]]}
      cols={6}
      rows={7}
      dotSize={8}
      gap={2}
      shape="circle"
      color="#fff"
      inactiveColor="rgba(255,255,255,.06)"
    />
  );
};

const Space = () => {
  return (
    <DotMatrix
      sequence={[[7, 12, 22, 27]]}
      cols={5}
      rows={7}
      dotSize={8}
      gap={2}
      shape="circle"
      color="#fff"
      inactiveColor="rgba(255,255,255,.06)"
    />
  );
};

const LeftDIGITS: Record<string, number[]> = {
  "0": [1, 2, 3, 5, 9, 10, 14, 15, 19, 20, 24, 25, 29, 31, 32, 33],
  "1": [3, 7, 8, 13, 18, 23, 28, 32, 33, 34],
  "2": [1, 2, 3, 5, 9, 14, 18, 22, 26, 30, 31, 32, 33, 34],
  "3": [1, 2, 3, 5, 9, 14, 17, 18, 24, 25, 29, 31, 32, 33],
  "4": [3, 7, 8, 11, 13, 15, 18, 20, 21, 22, 23, 24, 28, 33],
  "5": [0, 1, 2, 3, 4, 5, 10, 15, 16, 17, 18, 24, 25, 29, 31, 32, 33],
  "6": [2, 3, 4, 6, 10, 15, 16, 17, 18, 20, 24, 25, 29, 31, 32, 33],
  "7": [0, 1, 2, 3, 4, 9, 13, 17, 21, 26, 31],
  "8": [1, 2, 3, 5, 9, 10, 14, 16, 17, 18, 20, 24, 25, 29, 31, 32, 33],
  "9": [1, 2, 3, 5, 9, 10, 14, 16, 17, 18, 19, 24, 28, 31, 32],
};

const RightDIGITS: Record<string, number[]> = {
  "0": [2, 3, 4, 7, 11, 13, 17, 19, 23, 25, 29, 31, 35, 38, 39, 40],
  "1": [4, 9, 10, 16, 22, 28, 34, 39, 40, 41],
  "2": [2, 3, 4, 7, 11, 17, 22, 27, 32, 37, 38, 39, 40, 41],
  "3": [2, 3, 4, 7, 11, 17, 21, 22, 29, 31, 35, 38, 39, 40],
  "4": [4, 9, 10, 14, 16, 19, 22, 25, 26, 27, 28, 29, 34, 40],
  "5": [1, 2, 3, 4, 5, 7, 13, 19, 20, 21, 22, 29, 31, 35, 38, 39, 40],
  "6": [3, 4, 5, 8, 13, 19, 20, 21, 22, 25, 29, 31, 35, 38, 39, 40],
  "7": [1, 2, 3, 4, 5, 11, 16, 21, 26, 32, 38],
  "8": [2, 3, 4, 7, 11, 13, 17, 20, 21, 22, 25, 29, 31, 35, 38, 39, 40],
  "9": [2, 3, 4, 7, 11, 13, 17, 20, 21, 22, 23, 29, 34, 38, 39],
};

export const details = [
  {
    icon: "/assets/svg/mac-bulk.svg",
    title: "12 جلسه آموزش آنلاین",
    subtitle: "آنلاین و بدون ویدئو از پیش ضبط شده",
  },

  {
    icon: "/assets/svg/board-bulk.svg",
    title: "4 تا 5 هفته آموزشی",
    subtitle: "شامل بیش از 25 ساعت آموزش",
  },
  {
    icon: "/assets/svg/messages-bulk.svg",
    title: "پشتیبانی پس از دوره",
    subtitle: "تا 2 ماه پشتیبانی تلگرامی در انتهای دوره",
  },
  {
    icon: "/assets/svg/camera-bulk.svg",
    title: "دسترسی به ویدئو جلسات",
    subtitle: "قابلیت دانلود ویدئوهای تمامی جلسات",
  },
  {
    icon: "/assets/svg/folder-bulk.svg",
    title: "فایل‌های آموزشی",
    subtitle: "دسترسی به فایل‌های آموزشی مرتبط",
  },
];

const PaymentMethodDesktop = () => {
  return (
    <div className={styles.payment_wrapper}>
      <div className={styles.one}>
        <img src="/assets/svg/offer.svg" className={styles.offer} />
        <div className={styles.details_wrapper}>
          <span className={styles.heading}>ویژگی‌های دوره:</span>
          <div className={styles.details}>
            {details.map((detail) => (
              <Detail key={detail.title} detail={detail} />
            ))}
          </div>
        </div>
      </div>
      <div className={styles.two}>
        <a href={courses_link.odyssey}>ثبت نام در دوره</a>
        <span className={styles.dashed}>
          <img src="/assets/svg/dashed.svg" />
        </span>
      </div>
      <div className={styles.methods}>
        <div className={`${styles.method_wrapper} ${styles.cash}`}>
          <span className={`${styles.type} center`}>خرید نقدی</span>

          <div className={styles.price_wrapper}>
            <div className={styles.title}>هزینه ثبت نام</div>
            <span className={styles.price}>
              <span className={styles.discount}>4 میلیون تومان</span>
              <span className={styles.regular}>4.4 میلیون تومان</span>
            </span>
          </div>
        </div>
        <div className={`${styles.method_wrapper} ${styles.loan}`}>
          <img
            src="/assets/svg/safe_payemnt.svg"
            style={{
              position: "absolute",
              left: -35,
              bottom: 10,
              transform: "scale(0.9)",
            }}
          />
          <span className={`${styles.type} center`}>درگاه زیبال</span>

          <div className={styles.price_wrapper}>
            {/* <span className={styles.price}>
              <span className={styles.discount}>1 میلیون تومان</span>
            </span> */}
            <img src="/assets/svg/zibal.svg" style={{ height: 42 }} />

            <div className={styles.title}>خریدی سریع، امن و بدون دردسر</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PaymentMethodMobile = () => {
  return (
    <div className={styles.mobile_payment_wrapper}>
      <img src="/assets/svg/offer.svg" className={styles.offer} />
      <div className={styles.methods}>
        <div className={`${styles.method_wrapper} ${styles.cash}`}>
          <span className={`${styles.type} center`}>خرید نقدی</span>

          <div className={styles.price_wrapper}>
            <div className={styles.title}>هزینه ثبت نام</div>
            <span className={styles.price}>
              <span className={styles.discount}>4 میلیون تومان</span>
              <span className={styles.regular}>4.4 میلیون تومان</span>
            </span>
          </div>
        </div>
        <div className={`${styles.method_wrapper} ${styles.loan}`}>
          <img
            src="/assets/svg/safe_payemnt.svg"
            style={{
              position: "absolute",
              left: -25,
              bottom: 2,
              transform: "scale(0.7)",
            }}
          />
          <span className={`${styles.type} center`}>درگاه زیبال</span>

          <div className={styles.price_wrapper}>
            {/* <span className={styles.price}>
              <span className={styles.discount}>1 میلیون تومان</span>
            </span> */}
            <img src="/assets/svg/zibal.svg" style={{ height: 36 }} />

            <div className={styles.title}>خریدی سریع، امن و بدون دردسر</div>
          </div>
        </div>
      </div>
      <div className={styles.details_wrapper}>
        <span className={styles.heading}>ویژگی‌های دوره:</span>
        <div className={styles.details}>
          {details.map((detail) => (
            <Detail key={detail.title} detail={detail} />
          ))}
        </div>
      </div>

      <span className={styles.dashed}>
        <img src="/assets/svg/dashed.svg" />
      </span>

      <a href={courses_link.odyssey}>ثبت نام در دوره</a>
    </div>
  );
};

// const LeftDIGITS: Record<string, number[]> = {
//   "0": [0, 1, 2, 3, 4, 7, 8, 11, 12, 15, 16, 19, 20, 23, 24, 25, 26, 27],
//   "1": [3, 7, 11, 15, 19, 23, 27],
//   "2": [0, 1, 2, 3, 7, 11, 12, 13, 14, 15, 16, 20, 24, 25, 26, 27],
//   "3": [0, 1, 2, 3, 7, 11, 12, 13, 14, 15, 19, 23, 24, 25, 26, 27],
//   "4": [0, 3, 4, 7, 8, 11, 12, 13, 14, 15, 19, 23, 27],
//   "5": [0, 1, 2, 3, 4, 8, 12, 13, 14, 15, 19, 23, 24, 25, 26, 27],
//   "6": [0, 1, 2, 3, 4, 8, 12, 13, 14, 15, 16, 19, 20, 23, 24, 25, 26, 27],
//   "7": [0, 1, 2, 3, 7, 11, 15, 19, 23, 27],
//   "8": [
//     0, 1, 2, 3, 4, 7, 8, 11, 12, 13, 14, 15, 16, 19, 20, 23, 24, 25, 26, 27,
//   ],
//   "9": [0, 1, 2, 3, 4, 7, 8, 11, 12, 13, 14, 15, 19, 23, 24, 25, 26, 27],
// };

// const RightDIGITS: Record<string, number[]> = {
//   "0": [1, 2, 3, 4, 6, 9, 11, 14, 16, 19, 21, 24, 26, 29, 31, 32, 33, 34],
//   "1": [4, 9, 14, 19, 24, 29, 34],
//   "2": [1, 2, 3, 4, 9, 14, 16, 17, 18, 19, 21, 26, 31, 32, 33, 34],
//   "3": [1, 2, 3, 4, 9, 14, 16, 17, 18, 19, 24, 29, 31, 32, 33, 34],
//   "4": [1, 4, 6, 9, 11, 14, 16, 17, 18, 19, 24, 29, 34],
//   "5": [1, 2, 3, 4, 6, 11, 16, 17, 18, 19, 24, 29, 31, 32, 33, 34],
//   "6": [1, 2, 3, 4, 6, 11, 16, 17, 18, 19, 21, 24, 26, 29, 31, 32, 33, 34],
//   "7": [1, 2, 3, 4, 9, 14, 19, 24, 29, 34],
//   "8": [
//     1, 2, 3, 4, 6, 9, 11, 14, 16, 17, 18, 19, 21, 24, 26, 29, 31, 32, 33, 34,
//   ],
//   "9": [1, 2, 3, 4, 6, 9, 11, 14, 16, 17, 18, 19, 24, 29, 31, 32, 33, 34],
// };
