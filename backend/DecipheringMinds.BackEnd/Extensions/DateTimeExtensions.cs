using System;
using TimeZoneConverter;

namespace DecipheringMinds.BackEnd.Extensions
{
    public static class DateTimeExtensions
    {
        public static DateTime ToSETimeFromUtc(this DateTime value)
        {
            return TimeZoneInfo.ConvertTimeFromUtc(value, TZConvert.GetTimeZoneInfo("Singapore Standard Time"));
        }
    }
}