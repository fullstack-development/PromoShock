from datetime import date, datetime, timedelta


class Stream:
    def __init__(self, id: str, platform: str, schedule_date: date) -> None:
        self._id = id
        self._platform = platform
        self._schedule_date = schedule_date
        self._duration = None

    @property
    def is_completed(self):
        if self._duration is not None:
            end = self._schedule_date + self._duration
            return end >= self._schedule_date
        return False

    def set_duration(self, duration: timedelta):
        self._duration = duration
